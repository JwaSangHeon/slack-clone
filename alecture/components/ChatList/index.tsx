import { ChatZone, StickyHeader } from '@components/ChannelList/styles';
import React, { useCallback, useRef } from 'react';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Section } from '@components/ChatList/styles';

interface Props {
  chatSections: { [key: string]: IDM[] };
}

const ChatList = ({ chatSections }: Props) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
        {/* {chatSections?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))} */}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
