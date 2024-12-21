"use server";

import { Query, ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appWriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

async function getUserByEmail(email: string) {
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

async function sendEmailOTP({ email }: { email: string }) {
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
        avatar:
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
}
