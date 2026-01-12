import { CONTENT_MODES } from "@/app/utils/constants";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

interface ContentModeProps {
  selectMode: number | null;
  handleSelectMode: (selectedId: number) => void;
}

const ContentModes = ({ handleSelectMode, selectMode }: ContentModeProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
      {CONTENT_MODES.map((mode) => (
        <Card
          key={mode.id}
          onClick={() => handleSelectMode(mode.id)}
          className={cn(
            "cursor-pointer transition-shadow",
            selectMode === mode.id
              ? "border-green-700 border-2 shadow-lg"
              : "hover:shadow-lg transition-shadow hover:border-green-700 border"
          )}
        >
          <CardHeader>
            <div className="bg-green-200 w-10 h-10 flex items-center justify-center rounded-md mb-2">
              <mode.icon size={24} className="text-green-700" />
            </div>
            <CardTitle className="capitalize pb-0">{mode.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground font-light">
              {mode.description}
            </p>
            {/* <Badge className="mt-4 bg-green-300/50 text-green-700 font-semibold px-4 py-0 text-sm">
              {mode.credits} Credits
            </Badge> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContentModes;
