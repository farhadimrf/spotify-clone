import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";

const UploadModal = () => {
  const useUpload = useUploadModal();

  const onChange = (open: boolean) => {
    // Reset form
    if (!open) useUpload.onClose();
  };
  return (
    <Modal
      isOpen={useUpload.isOpen}
      onChange={onChange}
      title="Song"
      description="Upload an MP3 or MPEG files"
    >
      Vhilde
    </Modal>
  );
};

export default UploadModal;
