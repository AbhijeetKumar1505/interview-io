import React, { useState } from 'react';
import { Card, Typography, Alert } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ResumeUpload from '../components/ResumeUpload';
import MissingFieldPrompt from '../components/MissingFieldPrompt';

const { Title, Paragraph } = Typography;

const IntervieweePage: React.FC = () => {
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const resumeData = useSelector((state: RootState) => state.resume.data);
  const resumeError = useSelector((state: RootState) => state.resume.error);

  React.useEffect(() => {
    if (resumeData && resumeData.missingFields.length > 0) {
      setShowMissingFields(true);
    }
  }, [resumeData]);

  const handleMissingFieldsComplete = () => {
    setShowMissingFields(false);
    setInterviewStarted(true);
  };

  return (
    <Card>
      <Title level={2}>Welcome to Your Interview</Title>

      {resumeError && (
        <Alert
          message="Error"
          description={resumeError}
          type="error"
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      {!resumeData && !showMissingFields && (
        <>
          <Paragraph>
            Please upload your resume to begin the interview process.
          </Paragraph>
          <ResumeUpload />
        </>
      )}

      {showMissingFields && !interviewStarted && (
        <MissingFieldPrompt onComplete={handleMissingFieldsComplete} />
      )}

      {resumeData && !showMissingFields && (
        <div style={{ marginTop: 20 }}>
          <Alert
            message="Resume Processed Successfully"
            description={`Welcome ${resumeData.name}! Your resume has been processed.`}
            type="success"
            style={{ marginBottom: 16 }}
          />

          <Card size="small" style={{ marginTop: 16 }}>
            <Title level={4}>Your Information</Title>
            <Paragraph>
              <strong>Name:</strong> {resumeData.name}<br />
              <strong>Email:</strong> {resumeData.email}<br />
              <strong>Phone:</strong> {resumeData.phone}
            </Paragraph>
          </Card>

          {interviewStarted && (
            <Alert
              message="Interview Ready"
              description="Your profile is complete. The interview will begin shortly..."
              type="info"
              style={{ marginTop: 16 }}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default IntervieweePage;
