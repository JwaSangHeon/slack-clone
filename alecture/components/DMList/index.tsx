import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useState, VFC } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

interface Props {
  userData: IUser;
}

const DMList: VFC<Props> = ({ userData }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});

  return <div></div>;
};

export default DMList;
