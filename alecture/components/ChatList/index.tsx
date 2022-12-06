import { ChatZone } from '@components/ChannelList/styles';
import React from 'react';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
  chatData?: IDM[];
}

const ChatList = ({ chatData }: Props) => {
  return (
    <ChatZone>
      <Scrollbars autoHide>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
