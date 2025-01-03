import { ReactElement } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project import
import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AuthCard from './AuthCard';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';

interface Props {
    children: ReactElement;
}

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }: Props) {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <AuthBackground />
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
                    <Logo />
                </Grid>
                <Grid item xs={12}>
                    <Grid
                        item
                        xs={12}
                        container
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            minHeight: {
                                xs: 'calc(100vh - 190px)',
                                sm: 'calc(100vh - 114px)',
                                md: 'calc(100vh - 72px)'
                            }
                        }}
                    >
                        <Grid item>
                            <AuthCard>{children}</AuthCard>
                        </Grid>
                    </Grid>
                </Grid>
                {/*<Grid item xs={12} sx={{ m: 3, mt: 1 }}>*/}
                {/*  <AuthFooter />*/}
                {/*</Grid>*/}
            </Grid>
        </Box>
    );
}
