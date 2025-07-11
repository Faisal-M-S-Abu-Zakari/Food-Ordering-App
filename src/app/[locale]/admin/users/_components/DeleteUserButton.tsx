"use client";

// هان بكل اختصار هتمرر الاي دي تبع اليوزر لحتى تحذفه

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteUser } from "../_actions/user";
import { toast } from "sonner";

function DeleteUserButton({ userId }: { userId: string }) {
  // هان بمرر اوبجيكت لحتى اتجكم في التوست و الزر متى يكون شغال و الرسالة يلي بترجع
  const [state, setState] = useState<{
    pending: boolean;
    status: null | number;
    message: string;
  }>({
    pending: false,
    status: null,
    message: "",
  });
  const handleDelete = async (id: string) => {
    // اول نقطة انه ترجع الستايت زي ما هي و تكون قيمتها ترو
    try {
      setState((prev) => {
        return { ...prev, pending: true };
      });
      // الان بدك تحذف اليوزر
      const res = await deleteUser(id);
      // حدث قيمة الستايت من الريسبونس الراجع
      setState((prev) => {
        return { ...prev, status: res.status, message: res.message };
      });
    } catch (error) {
      console.log(error);
      // بالنهاية خلي البيندق بفولس
    } finally {
      setState((prev) => {
        return { ...prev, pending: false };
      });
    }
  };

  // بعد ما حدثت قيمة الستايت بناء على السيرفر اكشن , قم باظهار التوست مع كل تغيير
  useEffect(() => {
    if (state.message && state.status && !state.pending) {
      toast(
        <span
          className={
            `${state.status === 200}` ? "text-green-400" : "text-destructive"
          }
        >
          {state.message}
        </span>
      );
    }
  }, [state.pending, state.message, state.status]);
  return (
    <Button
      type="button"
      variant="outline"
      disabled={state.pending}
      onClick={() => handleDelete(userId)}
    >
      <Trash2 />
    </Button>
  );
}

export default DeleteUserButton;
