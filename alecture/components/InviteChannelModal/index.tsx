import useInput from '@hooks/useInput';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-toastify';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/LogIn/styles';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}
const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newMember, setNewMember, onChangeNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  // const { data } = useSWR<IChannel[]>(
  //   userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
  //   fetcher,
  // );

  const oninviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) return;

      axios
        .post(
          `/api/workspaces/${workspace}/channels/${channel}/members`,
          {
            email: newMember,
          },
          { withCredentials: true },
        )
        .then(() => {
          mutate(`/api/workspaces/${workspace}/channels/${channel}/members`);
          setShowInviteChannelModal(false);
          setNewMember('');
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember, workspace],
  );
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={oninviteMember}>
        <Label id="member-label">
          <span>채널 맴버 초대</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
