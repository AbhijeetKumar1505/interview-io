import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setResumeData } from '../store/slices/resumeSlice';
import './MissingFieldPrompt.css';

interface MissingFieldPromptProps {
  onComplete: () => void;
}

const MissingFieldPrompt: React.FC<MissingFieldPromptProps> = ({ onComplete }) => {
  const dispatch = useDispatch();
  const resumeData = useSelector((state: RootState) => state.resume.data);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [inputValue, setInputValue] = useState('');

  const missingFields = resumeData?.missingFields || [];
  const currentField = missingFields[currentFieldIndex];

  useEffect(() => {
    if (missingFields.length === 0) {
      onComplete();
    }
  }, [missingFields.length, onComplete]);

  const getFieldPrompt = (field: string): string => {
    switch (field) {
      case 'name':
        return "I couldn't find your name in the resume. Could you please provide your full name?";
      case 'email':
        return "I couldn't find your email address. Could you please provide your email?";
      case 'phone':
        return "I couldn't find your phone number. Could you please provide your phone number?";
      default:
        return `Please provide your ${field}:`;
    }
  };

  const validateField = (field: string, value: string): boolean => {
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      case 'phone':
        const phoneRegex = /^[\d\s()+-]+$/;
        const digits = value.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      case 'name':
        return value.trim().length > 0;
      default:
        return value.trim().length > 0;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentField) return;

    if (!validateField(currentField, inputValue)) {
      alert(`Please enter a valid ${currentField}`);
      return;
    }

    const updatedValues = { ...fieldValues, [currentField]: inputValue };
    setFieldValues(updatedValues);
    setInputValue('');

    if (currentFieldIndex < missingFields.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
    } else {
      if (resumeData) {
        dispatch(setResumeData({
          ...resumeData,
          name: updatedValues.name || resumeData.name,
          email: updatedValues.email || resumeData.email,
          phone: updatedValues.phone || resumeData.phone,
          missingFields: []
        }));
      }
      onComplete();
    }
  };

  if (missingFields.length === 0) {
    return null;
  }

  return (
    <div className="missing-field-prompt">
      <div className="chat-container">
        <div className="chat-header">
          <h3>Complete Your Profile</h3>
          <p>Step {currentFieldIndex + 1} of {missingFields.length}</p>
        </div>

        <div className="chat-messages">
          <div className="bot-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <p>{getFieldPrompt(currentField)}</p>
            </div>
          </div>

          {Object.entries(fieldValues).map(([field, value]) => (
            <div key={field} className="completed-field">
              <span className="field-label">{field}:</span>
              <span className="field-value">{value}</span>
              <span className="check-mark">✓</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type={currentField === 'email' ? 'email' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter your ${currentField}`}
            className="chat-input"
            required
            autoFocus
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentFieldIndex + 1) / missingFields.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MissingFieldPrompt;