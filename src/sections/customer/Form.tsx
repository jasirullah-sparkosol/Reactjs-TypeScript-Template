// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import MainCard from 'components/MainCard';
import { openSnackbar } from 'store/reducers/snackbar';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// types
import CameraOutlined from '@ant-design/icons/CameraOutlined';
import { FormLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { usePostSaveFileMutation } from 'api/services/fileApi';
import { useLazyGetPersonQuery, usePostPersonMutation, useUpdatePersonMutation } from 'api/services/personApi';
import Avatar from 'components/@extended/Avatar';
import Loader from 'components/Loader';
import { FormikHelpers } from 'formik/dist/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { dispatch } from 'store';
import { SnackbarProps } from 'types/snackbar';
import { getFullImagePath } from 'utils/imageUtils';
import { useGetRolesQuery } from 'api/services/roleApi';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface FormProps {
    id?: string;
}

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    phone: yup.string().required('Phone is required'),
    password: yup.string().required('Password is required'),
    email: yup.string().email('Enter valid email').optional(),
    country: yup.string().optional(),
    address: yup.string().optional(),
    odooCustomerId: yup.string().optional(),
    profilePicture: yup.string().optional(),
    role: yup.string().required('Role is required'),
    points: yup
        .number()
        .required('Points is required')
        .min(0, 'Points must be zero or a positive number')
        .integer('Points must be an integer'),
    redeemedPoints: yup
        .number()
        .required('Redeemed points is required')
        .min(0, 'Redeemed points must be zero or a positive number')
        .integer('Redeemed points must be an integer'),
    addedInOdoo: yup.boolean().optional().default(false)
});

type CustomerFormType = yup.InferType<typeof validationSchema>;

const initialValues: CustomerFormType = {
    name: '',
    phone: '',
    address: '',
    odooCustomerId: '',
    profilePicture: '',
    role: '',
    points: 0,
    redeemedPoints: 0,
    addedInOdoo: false,
    email: '',
    country: '',
    password: ''
};

const odoOptions = [
    { value: true, text: 'Yes' },
    { value: false, text: 'No' }
];

export default function Form({ id }: FormProps) {
    const [refetch, { data: person, isLoading }] = useLazyGetPersonQuery();
    const [updatePerson] = useUpdatePersonMutation();
    const [postPerson] = usePostPersonMutation();
    const [postSaveFile] = usePostSaveFileMutation();
    const { data: roles } = useGetRolesQuery(undefined, { refetchOnMountOrArgChange: true });

    const navigate = useNavigate();
    const { user } = useAuth();

    const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
    const [avatar, setAvatar] = useState<string | undefined>('/assets/images/users/default.png');
    const role = roles?.find((role) => role.name === 'User');

    const onSubmit = async (values: CustomerFormType, { setFieldValue }: FormikHelpers<CustomerFormType>) => {
        let profilePicture = values.profilePicture;
        let response;
        if (selectedImage) {
            response = await postSaveFile(selectedImage);
            if (response && response.data) {
                await setFieldValue('profilePicture', response.data.path ?? '');
                profilePicture = response.data.path ?? '';
            }
        }
        if (id) {
            response = await updatePerson({
                ...values,
                _id: id,
                addedInOdoo: Boolean(values.addedInOdoo),
                profilePicture
            });
        } else {
            response = await postPerson({
                ...values,
                performedBy: user?._id,
                addedInOdoo: Boolean(values.addedInOdoo),
                profilePicture
            });
        }

        if (response.error as FetchBaseQueryError) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: response?.error ?? 'Error in update customer!',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                } as SnackbarProps)
            );

            return;
        }

        dispatch(
            openSnackbar({
                open: true,
                message: `Customer ${id ? 'updated' : 'create'} successfully!`,
                variant: 'alert',
                alert: {
                    color: 'success'
                }
            } as SnackbarProps)
        );

        navigate('/customers');
    };

    const { setFieldValue, errors, touched, handleBlur, handleChange, setValues, handleSubmit, values, isSubmitting } = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    });

    useEffect(() => {
        if (selectedImage) setAvatar(URL.createObjectURL(selectedImage));
    }, [selectedImage]);

    useEffect(() => {
        if (role) {
            setFieldValue('role', role._id);
        }
    }, [role, setFieldValue]);

    // on mounted
    useEffect(() => {
        if (person) {
            setValues({ ...(person as any) });
            if (person.profilePicture) {
                setAvatar(getFullImagePath(person.profilePicture));
            }
        }
    }, [person, setValues]);

    useEffect(() => {
        if (id) refetch(id);
    }, [id, refetch]);

    if (isLoading) return <Loader />;

    return (
        <MainCard>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
                            <FormLabel
                                htmlFor="change-avtar"
                                sx={{
                                    position: 'relative',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    '&:hover .MuiBox-root': { opacity: 1 },
                                    cursor: 'pointer'
                                }}
                            >
                                <Avatar alt="Avatar 1" src={avatar} sx={{ width: 150, height: 150 }} style={{ objectFit: 'contain' }} />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        background: 'rgba(0,0,0,.65)',
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Stack spacing={0.5} alignItems="center">
                                        <CameraOutlined style={{ fontSize: '1.5rem' }} />
                                        <Typography sx={{ color: 'secondary.lighter' }} variant="caption">
                                            Upload
                                        </Typography>
                                    </Stack>
                                </Box>
                            </FormLabel>
                            <TextField
                                type="file"
                                id="change-avtar"
                                placeholder="Outlined"
                                variant="outlined"
                                sx={{ display: 'none' }}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedImage(e.target.files?.[0])}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                placeholder="Enter name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                placeholder="Enter email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                placeholder="Enter password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="country">Country</InputLabel>
                            <TextField
                                fullWidth
                                id="country"
                                name="country"
                                placeholder="Enter country"
                                value={values.country}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.country && Boolean(errors.country)}
                                helperText={touched.country && errors.country}
                            />
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="phone">Phone</InputLabel>
                            <TextField
                                fullWidth
                                id="phone"
                                name="phone"
                                placeholder="Enter phone"
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.phone && Boolean(errors.phone)}
                                helperText={touched.phone && errors.phone}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="points">Points</InputLabel>
                            <TextField
                                fullWidth
                                id="points"
                                name="points"
                                type="number"
                                placeholder="Enter points"
                                value={values.points}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                inputProps={{ min: 0 }}
                                error={touched.points && Boolean(errors.points)}
                                helperText={touched.points && errors.points}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="redeemedPoints">Redeemed Points</InputLabel>
                            <TextField
                                fullWidth
                                id="redeemedPoints"
                                name="redeemedPoints"
                                type="number"
                                placeholder="Enter redeemedPoints"
                                value={values.redeemedPoints}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                inputProps={{ min: 0 }}
                                error={touched.redeemedPoints && Boolean(errors.redeemedPoints)}
                                helperText={touched.redeemedPoints && errors.redeemedPoints}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="address">Address</InputLabel>
                            <TextField
                                fullWidth
                                id="address"
                                name="address"
                                placeholder="Enter address"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.address && Boolean(errors.address)}
                                helperText={touched.address && errors.address}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="odooCustomerId">CustomerId in Odoo</InputLabel>
                            <TextField
                                fullWidth
                                disabled={true}
                                id="odooCustomerId"
                                name="odooCustomerId"
                                placeholder="Enter odooCustomerId"
                                value={values.odooCustomerId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.odooCustomerId && Boolean(errors.odooCustomerId)}
                                helperText={touched.odooCustomerId && errors.odooCustomerId}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="addedInOdoo">Added in Odoo</InputLabel>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    id="addedInOdoo"
                                    name="addedInOdoo"
                                    value={values.addedInOdoo}
                                    placeholder="Select addedInOdoo"
                                    error={touched.addedInOdoo && Boolean(errors.addedInOdoo)}
                                    onChange={handleChange}
                                >
                                    {odoOptions &&
                                        odoOptions.map((option: any, key: number) => (
                                            <MenuItem key={key} value={option.value}>
                                                {option.text}
                                            </MenuItem>
                                        ))}
                                </Select>
                                {touched.addedInOdoo && Boolean(errors.addedInOdoo) && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {' '}
                                        {errors.addedInOdoo}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end">
                            <AnimateButton>
                                <Button variant="contained" type="submit">
                                    {isSubmitting ? 'Submiting...' : id ? 'Update User' : 'Create user '}
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </MainCard>
    );
}
