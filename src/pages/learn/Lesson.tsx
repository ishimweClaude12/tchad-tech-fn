import { useNavigate, useParams } from "react-router-dom";
import { useLessonById } from "src/hooks/learn/useLessonApi";
import { Button, Card, CardContent, Divider, Typography } from "@mui/material";

// Decode HTML entities while preserving HTML structure
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

const Lesson = () => {
  const navigate = useNavigate();
  const { lessonId = "" } = useParams<{ lessonId: string }>();

  const { data: lessonData, isLoading, error } = useLessonById(lessonId);

  if (isLoading) {
    return <div className="p-6">Loading lesson...</div>;
  }

  if (error || !lessonData) {
    return <div className="p-6 text-red-500">Failed to load lesson.</div>;
  }

  const lesson = lessonData.data.lesson;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Navigation */}
      <Button variant="outlined" onClick={() => navigate(-1)}>
        Back to module
      </Button>

      {/* Lesson Header */}
      <Card className="shadow-sm">
        <CardContent className="space-y-2">
          <Typography variant="h4" fontWeight={600}>
            {lesson.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {lesson.description}
          </Typography>

          <Divider />

          <Typography variant="caption" color="text.secondary">
            {lesson.durationMinutes} minutes
          </Typography>
        </CardContent>
      </Card>

      {/* Lesson Content */}
      {lesson.contentType === "TEXT" && lesson.textContent && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div
              className="prose prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:list-disc prose-ul:my-4 prose-ol:list-decimal prose-ol:my-4
                prose-li:text-gray-700 prose-li:my-1
                prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:my-4
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-4
                [&_p:empty]:h-6"
              dangerouslySetInnerHTML={{
                __html: decodeHTMLEntities(lesson.textContent || ""),
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Video Content Placeholder */}
      {lesson.contentType === "VIDEO" && lesson.contentUrl && (
        <Card className="shadow-sm">
          <CardContent>
            <video
              controls
              className="w-full rounded-lg"
              src={lesson.contentUrl}
            >
              <track kind="captions" />
            </video>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Lesson;
