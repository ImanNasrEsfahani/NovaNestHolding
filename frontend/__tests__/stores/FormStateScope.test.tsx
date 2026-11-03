import { fireEvent, render, screen } from '@testing-library/react';
import FormStateScope from '@/stores/FormStateScope';
import { useSubmit } from '@/stores/dataStore';
import { useFile } from '@/stores/fileStore';

let mockPathname = '/en/join-as-a-mentor';
jest.mock('next/navigation', () => ({ usePathname: () => mockPathname }));

function Probe() {
  const send = useSubmit(s => s.send);
  const setSending = useSubmit(s => s.handleSendChange);
  const file = useFile(s => s.cvFileState.cvFile);
  const setFile = useFile(s => s.handleCvFileChange);
  return (
    <div>
      <output data-testid="send">{send ? 'sending' : 'idle'}</output>
      <output data-testid="file">{file instanceof File ? file.name : 'empty'}</output>
      <button type="button" onClick={() => {
        setSending(true);
        setFile({ cvFile: new File(['test'], 'resume.pdf', { type: 'application/pdf' }) });
      }}>Select</button>
    </div>
  );
}

describe('route-scoped form and CV stores', () => {
  it('starts fresh when navigation moves to another form page', () => {
    mockPathname = '/en/join-as-a-mentor';
    const { rerender } = render(<FormStateScope><Probe /></FormStateScope>);
    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    expect(screen.getByTestId('send')).toHaveTextContent('sending');
    expect(screen.getByTestId('file')).toHaveTextContent('resume.pdf');

    mockPathname = '/en/join-as-a-trainee';
    rerender(<FormStateScope><Probe /></FormStateScope>);
    expect(screen.getByTestId('send')).toHaveTextContent('idle');
    expect(screen.getByTestId('file')).toHaveTextContent('empty');
  });
});
