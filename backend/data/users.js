import bcrypt from 'bcryptjs';

const users = [
	{
		name: 'Admin',
		email: 'admin@admin.com',
		password: bcrypt.hashSync('admin', 12),
		isAdmin: true,
		isConfirmed: true,
		avatar: '/images/icon_user.png',
	},
	{
		name: 'Test1',
		email: 'test1@gmail.com',
		password: bcrypt.hashSync('pass123', 12),
		isConfirmed: true,
		avatar: '/images/icon_user.png',
	},
	{
		name: 'Test2',
		email: 'test2@gmail.com.com',
		password: bcrypt.hashSync('pass123', 12),
		isConfirmed: true,
		avatar: '/images/icon_user.png',
	},
	{
		name: 'Test3',
		email: 'test3@gmail.com',
		password: bcrypt.hashSync('pass123', 12),
		isConfirmed: true,
		avatar: '/images/icon_user.png',
	},
];

export default users;
