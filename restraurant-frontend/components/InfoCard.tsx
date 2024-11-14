import React from "react";
import { Card, CardContent } from "./ui/card";

const InfoCard = ({ info, message }: { info: string; message: string }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <p className="text-lg font-semibold text-center">{info}</p>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          {message}
        </p>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
