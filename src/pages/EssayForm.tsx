import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import ProgressiveForm from "@/components/ProgressiveForm";

const EssayForm = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <section className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">学术写作助手</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/knowledge')}
            className="gap-2"
          >
            <Database className="h-4 w-4" />
            知识库
          </Button>
        </div>
        <ProgressiveForm />
      </section>
    </main>
  );
};

export default EssayForm;