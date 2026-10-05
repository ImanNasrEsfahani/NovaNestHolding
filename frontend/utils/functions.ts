const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, setState: any) => {
    setState(event.target.value);
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setState: any) => {
    const inputName = event.target.name;
    const file = event.target.files && event.target.files[0];
  
    if (file) {
      switch (inputName) {
        case 'pitchDeckFile':
          setState({ pitchDeckFile: file });
          break;
        case 'businessPlanFile':
          setState({ businessPlanFile: file });
          break;
        case 'financialFile':
          setState({ financialFile: file });
          break;
        default:
          console.error('Invalid file input name:', inputName);
      }
    }
};

const handleCvFileChange = (event: React.ChangeEvent<HTMLInputElement>, setState: any) => {
  const file = event.target.files && event.target.files[0];

  if (file) {
    setState({ cvFile: file });
  }
};

export {
    handleRadioChange,
    handleFileChange,
    handleCvFileChange
}