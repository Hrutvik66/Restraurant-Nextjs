import React from "react";
import { Card, CardContent } from "./ui/card";
import { Loader2 } from "lucide-react";

const Loader = ({ info }: { info: string }) => {
  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-16 w-16 animate-spin text-orange-500 mb-4" />
          <p className="text-lg font-semibold">{info}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loader;
