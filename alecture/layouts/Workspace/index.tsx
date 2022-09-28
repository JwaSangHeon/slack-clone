import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState, VFC } from 'react';
import {
  Header,
  RightMenu,
  ProfileImg,
  WorkspaceWrapper,
  LogOutButton,
  WorkspaceName,
  Workspaces,
  Channels,
  Chats,
  MenuScroll,
  ProfileModal,
  WorkspaceButton,
  AddButton,
  WorkspaceModal,
} from '@layouts/Workspace/styles';
import { Redirect, Route, Switch, useParams } from 'react-router';
import gravatar from 'gravatar';
import useSWR from 'swr';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import CreateChannelModal from '@components/CreateChannelModal';
import { Link } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';
import { Button, Input, Label } from '@pages/LogIn/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import { toast } from 'react-toastify';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: VFC = () => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const [showCreateWorkSpaceModal, setShowCreateWorkSpaceModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkSpaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newWorkspace, setNewWorkspace, onChangeNewWorkspace] = useInput('');
  const [newUrl, setNewUrl, onChangeNewUrl] = useInput('');

  const { workspace } = useParams<{ workspace: string }>();

  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, { withCredentials: true })
      .then((response) => {
        mutate(false, false);
      })
      .catch((err) => console.log(err));
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickCreateWorkSpace = useCallback(() => {
    setShowCreateWorkSpaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkSpaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  const onCreateWorkSpace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          'http://localhost:3095/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          { withCredentials: true },
        )
        .then(() => {
          mutate();
          setShowCreateWorkSpaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response.data, { position: 'bottom-center' });
        });
    },
    [newUrl, newWorkspace],
  );

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkSpaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData.Workspaces?.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkSpace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickAddChannel}>채널만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {channelData?.map((v) => (
              <div>{v.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkSpaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkSpace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
    </div>
  );
};

export default Workspace;
