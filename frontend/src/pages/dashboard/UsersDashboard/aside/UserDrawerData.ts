import { AiOutlineUser, AiOutlineFileText, AiOutlineLogout } from 'react-icons/ai';

export const userDrawerData = [
  {
    id: 'profile',
    name: 'My Profile',
    icon: AiOutlineUser,
    link: 'profile',
  },
  {
    id: 'posts',
    name: 'My Posts',
    icon: AiOutlineFileText,
    link: 'posts',
  },
  {
    id: 'following',
    name: 'Following',
    icon: AiOutlineUser,
    link: 'following',
  },
  {
    id: 'logout',
    name: 'Log Out',
    icon: AiOutlineLogout,
    link: 'logout',
  },
];