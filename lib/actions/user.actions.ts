"use server";
import { Query, ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appWriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlacehoderURL } from "@/constants";

export async function getUserByEmail(email: string) {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appWriteConfig.databaseId,
    appWriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
}

function handleError(error: unknown, message: string) {
  console.log(error, message);
  throw error;
}

export async function sendEmailOTP({ email }: { email: string }) {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
}

export async function createAccount({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send a OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlacehoderURL,
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
}

export async function verifySecret({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
}

export async function getCurrentUser() {
  const { databases, account } = await createSessionClient();

  const result = await account.get();

  const user = await databases.listDocuments(
    appWriteConfig.databaseId,
    appWriteConfig.usersCollectionId,
    [Query.equal("accountId", result.$id)]
  );

  if (user.total <= 0) return null;

  return parseStringify(user.documents[0]);
}
