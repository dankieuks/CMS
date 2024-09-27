'use client'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, MenuProps, message, Space, Tooltip } from 'antd';
import React from 'react'

const Profile: React.FC = () => {
    const items: MenuProps['items'] = [
        {
            label: 'View Profile',
            key: '1',
            icon: <UserOutlined />,
        },
        {
            label: 'Settings',
            key: '2',
            icon: <SettingOutlined />,
        },
        {
            label: 'Logout',
            key: '3',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '3') {
            message.success('Successfully logged out.');
        } else {
            message.info(`Clicked on `);
        }
        console.log('click', e);
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <div className="flex items-center gap-2">
            <Space wrap>
                <Dropdown menu={menuProps} placement="bottom">
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                </Dropdown>

            </Space>
        </div>
    )
}

export default Profile;
