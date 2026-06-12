import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Save } from "lucide-react";
import { generateCoverLetter, updateCoverLetter } from "@/api/applications";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COVER_LETTER_TONES } from "@/lib/constants";

export default function CoverLetterTab({ appId, coverLetter, onChange }) {
  const [text, setText] = useState(coverLetter || "");
  const [tone, setTone] = useState("professional");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const onGenerate = async () => {
    setGenerating(true);
    try {
      const res = await generateCoverLetter(appId, tone);
      const newLetter = res.data.data.coverLetter;
      setText(newLetter);
      onChange(newLetter);
      toast.success("Cover letter generated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await updateCoverLetter(appId, text);
      onChange(res.data.data.coverLetter);
      toast.success("Cover letter saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save cover letter");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COVER_LETTER_TONES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onGenerate} disabled={generating}>
            <Sparkles className="size-4" />
            {generating ? "Generating..." : text ? "Regenerate" : "Generate"}
          </Button>
        </div>
        <Button onClick={onSave} disabled={saving || text === (coverLetter || "")}>
          <Save className="size-4" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={16}
        placeholder="Generate a cover letter with AI, or write your own here..."
        className="font-mono text-sm"
      />
    </div>
  );
}
