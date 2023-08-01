import useUploadModal from "@/hooks/useUploadModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

const UploadModal = () => {
  const useUpload = useUploadModal();
  const [isLoading, setIsLoading] = useState();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    reset();
    if (!open) useUpload.onClose();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // Upload to supabase
  };
  return (
    <Modal
      isOpen={useUpload.isOpen}
      onChange={onChange}
      title="Song"
      description="Upload an MP3 or MPEG files"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("authoe", { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3,.mpeg"
            {...register("song", { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select am image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
