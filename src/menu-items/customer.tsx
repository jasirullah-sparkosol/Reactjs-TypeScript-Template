// This is example of menu item without group for horizontal layout. There will be no children.
import { UserOutlined } from '@ant-design/icons';

// third-party
import { FormattedMessage } from 'react-intl';

// type
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const user: NavItemType = {
    id: 'customers',
    type: 'group',
    title: <FormattedMessage id="Customers" />,
    url: '/customers',
    icon: UserOutlined
};

export default user;
