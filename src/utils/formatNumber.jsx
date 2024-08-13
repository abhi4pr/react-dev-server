export  const formatNumber = (value) => {
  if (value == null || isNaN(value)) {
    return "0"; // Or any default string you prefer
  }

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}k`;
    } else {
      return value?.toString();
      
    }
  };
    


