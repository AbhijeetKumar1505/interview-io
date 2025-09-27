# Resume Upload & Extraction Feature Documentation

## Overview
The Resume Upload & Extraction feature allows candidates to upload their resumes in PDF or DOCX format, automatically extracts key information (name, email, phone), and prompts for any missing fields through an interactive chatbot interface.

## Features

### 1. File Upload
- **Supported Formats**: PDF (.pdf) and DOCX (.docx)
- **Upload Methods**:
  - Drag and drop files onto the upload area
  - Click to browse and select files
- **File Validation**: Automatically validates file type before processing

### 2. Text Extraction
- **PDF Processing**: Uses `pdfjs-dist` library for browser-compatible PDF text extraction
- **DOCX Processing**: Uses `mammoth-ts` library for Word document text extraction
- **Cross-browser Support**: Works entirely in the browser without server-side processing

### 3. Field Extraction
Automatically extracts the following fields using regex patterns:
- **Name**: Detects full names from the first few lines of the resume
- **Email**: Extracts email addresses using standard email regex
- **Phone**: Identifies phone numbers and formats them as (XXX) XXX-XXXX

### 4. Missing Field Validation
- **Automatic Detection**: Identifies which required fields are missing
- **Interactive Prompts**: Chatbot-style interface to collect missing information
- **Field Validation**:
  - Email: Validates format
  - Phone: Validates digit count (10-15 digits)
  - Name: Ensures non-empty input
- **Progress Tracking**: Visual progress bar shows completion status

### 5. State Management
- **Redux Integration**: All resume data stored in Redux store
- **Persistent State**: Resume data persists across component re-renders
- **Error Handling**: Comprehensive error states and user feedback

## Technical Architecture

### Component Structure

```
src/
├── components/
│   ├── ResumeUpload.tsx        # Main upload component
│   ├── ResumeUpload.css        # Upload component styles
│   ├── MissingFieldPrompt.tsx  # Chatbot prompt component
│   └── MissingFieldPrompt.css  # Chatbot styles
├── utils/
│   └── resumeParser.ts          # Text extraction and field parsing logic
├── store/
│   └── slices/
│       └── resumeSlice.ts       # Redux slice for resume state
├── pages/
│   └── IntervieweePage.tsx      # Integration page
└── types/
    └── mammoth-ts.d.ts          # Type declarations for mammoth-ts
```

### Data Flow

1. **Upload**: User uploads PDF/DOCX file via ResumeUpload component
2. **Extraction**: File processed by resumeParser utility
3. **Storage**: Extracted data stored in Redux store
4. **Validation**: System checks for missing required fields
5. **Prompting**: If fields missing, MissingFieldPrompt component activates
6. **Completion**: Once all fields collected, interview can proceed

### Redux State Structure

```typescript
interface ResumeState {
  data: {
    name: string | null;
    email: string | null;
    phone: string | null;
    fullText: string;
    missingFields: string[];
  } | null;
  isLoading: boolean;
  error: string | null;
}
```

## API Reference

### resumeParser.ts

#### `extractTextFromFile(file: File): Promise<string>`
Extracts text content from uploaded PDF or DOCX file.

#### `extractFields(text: string): ExtractedFields`
Parses text to extract name, email, and phone fields.

#### `getMissingFields(fields: ExtractedFields): string[]`
Returns array of missing required fields.

### Redux Actions

#### `setResumeData(data: ResumeData)`
Updates resume data in store.

#### `setLoading(isLoading: boolean)`
Sets loading state during file processing.

#### `setError(error: string)`
Sets error message for user feedback.

#### `clearResume()`
Resets all resume data.

## User Experience Flow

1. **Initial State**: User sees upload interface with drag-drop area
2. **File Selection**: User uploads resume via drag-drop or file browser
3. **Processing**: Loading indicator while extracting text
4. **Field Extraction**: System automatically parses name, email, phone
5. **Validation Check**:
   - If all fields found → Success message displayed
   - If fields missing → Chatbot prompts appear
6. **Missing Field Collection**: Interactive chat collects missing info
7. **Completion**: Profile complete, ready for interview

## Styling

### Design Principles
- **Modern UI**: Clean, gradient-based design
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Visual Feedback**: Clear states for upload, processing, success, error

### Color Scheme
- Primary: #6366f1 (Indigo)
- Success: #10b981 (Green)
- Error: #ef4444 (Red)
- Background: #f8fafc (Light gray)

## Error Handling

### Common Errors
1. **Invalid File Type**: Shows error if non-PDF/DOCX uploaded
2. **Processing Error**: Displays message if extraction fails
3. **Network Error**: Handles CDN issues for PDF.js worker
4. **Validation Error**: Prompts user to correct invalid field inputs

### Error Recovery
- Users can remove and re-upload files
- Failed fields can be manually entered
- Clear error messages guide users to resolution

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Requirements
- JavaScript enabled
- WebAssembly support (for PDF.js)
- Modern CSS Grid/Flexbox support

## Dependencies

### Production Dependencies
- `pdfjs-dist`: PDF text extraction in browser
- `mammoth-ts`: DOCX to text conversion
- `@reduxjs/toolkit`: State management
- `react-redux`: React bindings for Redux

### Development Dependencies
- `@types/pdfjs-dist`: TypeScript definitions
- Custom type declarations for mammoth-ts

## Security Considerations

1. **Client-Side Processing**: All file processing happens in browser
2. **No Server Upload**: Files never leave user's device
3. **Data Validation**: Input sanitization for extracted fields
4. **XSS Prevention**: React's built-in XSS protection
5. **Content Security**: PDF.js worker loaded from trusted CDN

## Performance Optimization

1. **Lazy Loading**: PDF/DOCX libraries loaded only when needed
2. **Efficient Parsing**: Text extraction optimized for speed
3. **Debounced Updates**: Redux updates batched for performance
4. **Memory Management**: File objects properly released after processing

## Future Enhancements

### Planned Features
1. Support for additional file formats (TXT, RTF)
2. Advanced field extraction (education, experience, skills)
3. Multi-language resume support
4. Resume scoring and suggestions
5. Bulk resume upload for recruiters

### Technical Improvements
1. Web Worker integration for heavy processing
2. IndexedDB caching for processed resumes
3. Progressive enhancement for older browsers
4. Enhanced accessibility features

## Troubleshooting

### Common Issues and Solutions

#### PDF Text Not Extracting
- **Cause**: Scanned PDF without text layer
- **Solution**: Implement OCR support or prompt manual entry

#### DOCX Format Error
- **Cause**: Corrupted or password-protected file
- **Solution**: Validate file integrity, prompt for new upload

#### Missing Fields Not Detected
- **Cause**: Unusual resume formatting
- **Solution**: Improve regex patterns, add fallback prompts

#### Slow Processing
- **Cause**: Large file size or complex formatting
- **Solution**: Show progress indicator, optimize extraction

## Testing Guide

### Unit Tests
```typescript
// Test file upload validation
// Test text extraction functions
// Test field parsing regex
// Test Redux actions and reducers
```

### Integration Tests
```typescript
// Test full upload flow
// Test missing field prompts
// Test error scenarios
// Test browser compatibility
```

### Manual Testing Checklist
- [ ] Upload PDF file
- [ ] Upload DOCX file
- [ ] Test drag and drop
- [ ] Test file validation
- [ ] Verify field extraction
- [ ] Complete missing field prompts
- [ ] Test error states
- [ ] Check responsive design

## Maintenance

### Regular Updates
1. Update PDF.js CDN version quarterly
2. Review and improve regex patterns
3. Monitor browser compatibility
4. Update dependencies for security

### Monitoring
- Track extraction success rates
- Monitor processing times
- Log common extraction failures
- Collect user feedback

## Support

For issues or questions about the Resume Upload & Extraction feature:
1. Check this documentation
2. Review error messages in browser console
3. Contact development team with:
   - Browser version
   - File type and size
   - Error messages
   - Steps to reproduce