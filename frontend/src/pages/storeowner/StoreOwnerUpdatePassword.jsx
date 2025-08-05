import StoreOwnerLayout from "@/layouts/StoreOwnerLayout";
import PasswordUpdateForm from "@/components/PasswordUpdateForm";

const StoreUpdatePassword = () => (
  <StoreOwnerLayout>
    <div className="flex justify-center py-10">
      <PasswordUpdateForm />
    </div>
  </StoreOwnerLayout>
);

export default StoreUpdatePassword;
