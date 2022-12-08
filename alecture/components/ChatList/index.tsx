import { ChatZone, StickyHeader } from '@components/ChannelList/styles';
import React, { useCallback, forwardRef, RefObject } from 'react';
import { IChat, IDM } from '@typings/db';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Section } from '@components/ChatList/styles';

interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] };
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
  scrollRef: RefObject<Scrollbars>;
}

const ChatList = ({ chatSections, setSize, isEmpty, isReachingEnd, scrollRef }: Props) => {
  const onScroll = useCallback((values) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      console.log('TOP');
      setSize((prev) => prev + 1).then(() => {
        if (scrollRef?.current) {
          scrollRef.current?.scrollTop(scrollRef.current?.getScrollHeight() - values.scrollHeight);
        }
      });
    }
  }, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
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
