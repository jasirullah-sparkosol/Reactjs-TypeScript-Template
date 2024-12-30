import { LoadingOutlined } from '@ant-design/icons';
import { Box, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';

function Spinning({
    children,
    loading = false,
    component
}: {
    children: ReactNode;
    loading?: boolean;
    component?: 'tbody' & React.ElementType<any, keyof React.JSX.IntrinsicElements>;
}) {
    const theme = useTheme();
    if (!loading) return children;
    return (
        <Box position="relative" component={component}>
            <Box
                position="absolute"
                bgcolor="rgba(0,0,0,0.1)"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
                top={0}
                left={0}
                width="100%"
                zIndex={10}
                bottom={0}>
                <LoadingOutlined color="primary" style={{ fontSize: 30, color: theme.palette.primary.main }} />
            </Box>
            {children}
        </Box>
    );
}

export default Spinning;
