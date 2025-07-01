"use client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// it will take the initial session from server (next-auth)
// then get the session from the client component
// then update the session when the session changes
// then set the initial session when the component mounts
// then return the session and the status of the session

export const useClientSession = (initialSession: Session | null) => {
  const { data: session, status } = useSession();
  //   until here i have the session from the server and the session from the client
  //   now i want to update the session when the session changes

  const [currentSession, setCurrentSession] = useState(initialSession);
  //   so , if the session from the client appear , so i will update the session from the client
  useEffect(() => {
    if (session) {
      setCurrentSession(session);
    }
  }, [session]);

  //   so , if the session from the server appear , so i will update the session from the server
  //   in the future if i change the role of the user , so i will update the session from the server to update the current session
  useEffect(() => {
    if (initialSession) {
      setCurrentSession(initialSession);
    }
  }, [initialSession]);
  return { data: currentSession, status };
};
// باختصار هذه الهوك هي للحصول على الجلسة من الخادم والجلسة من العميل وتحديث الجلسة من العميل وتحديث الجلسة من الخادم
// وتحديث الجلسة من الخادم في المستقبل إذا قمت بتغيير دور المستخدم
// وتحديث الجلسة من العميل في المستقبل إذا قمت بتغيير دور المستخدم
