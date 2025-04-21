import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const useResponsive = () => {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const [screenSize, setScreenSize] = useState<string>('');

  useEffect(() => {

    setScreenSize(isSmallScreen ? 'small' : 'medium');


  }, [isSmallScreen]);
  return screenSize;
};

export default useResponsive;
