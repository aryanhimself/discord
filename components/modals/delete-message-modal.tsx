"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { DialogHeader } from "../ui/dialog";
import qs from "query-string";

import { Button } from "../ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";

const DeleteMessageModal = () => {
  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query },
  } = useModal();
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteMessageModal";
  const onClick = async () => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl!,
        query: query,
      });
      setLoading(true);
      await axios.delete(url);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center  text-2xl font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this ? message will be permanently
            deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={loading} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={onClick} variant={"primary"}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
