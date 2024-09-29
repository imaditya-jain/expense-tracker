// src/hooks/useBreakpoints.js

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
const useBreakpoints = () => {
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // <600px
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
    const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // >900px

    return { isMobile, isTablet, isDesktop };
};

export default useBreakpoints;
