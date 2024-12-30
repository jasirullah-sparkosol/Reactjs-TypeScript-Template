import Form from 'sections/customer/Form';
import { useParams } from 'react-router';

const EditView = () => {
    const { id } = useParams();
    return <Form id={id} />;
};

export default EditView;
