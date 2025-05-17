import ForgotPasswordForm from "./ForgotPasswordPageComponents/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  
  return (
    <div className="
        min-h-screen flex items-center justify-center
        bg-cover bg-center
        md:bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')]
        bg-white
      "
    >
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;