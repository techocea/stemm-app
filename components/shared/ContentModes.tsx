import { Badge } from "../ui/badge";
import { CONTENT_MODES } from "@/app/utils/constants";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ContentModes = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
      {CONTENT_MODES.map((mode) => (
        <Card key={mode.id} className="cursor-pointer hover:shadow-lg transition-shadow hover:border-green-700">
          <CardHeader className="pb-0">
            <div className="bg-green-200 w-10 h-10 flex items-center justify-center rounded-md mb-2">
              <mode.icon size={24} className="text-green-700" />
            </div>
            <CardTitle className="capitalize">{mode.title}</CardTitle>
          </CardHeader>
          <CardContent className="mt-0">
            <p className="text-sm text-muted-foreground font-medium">{mode.description}</p>
            <Badge className="mt-4 bg-green-300/50 text-green-700 font-semibold px-4 py-0 text-sm">{mode.credits} Credits</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContentModes;
