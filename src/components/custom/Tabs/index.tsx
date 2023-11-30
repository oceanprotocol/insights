import React, { ReactElement, ReactNode } from 'react';
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs';
import styles from './index.module.css';
import InputRadio from '../Inputs/Radio';
export interface TabsItem {
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabsItem[];
  className?: string;
  handleTabChange?: (tabName: string) => void;
  defaultIndex?: number;
  showRadio?: boolean;
  selectedIndex?: number;
  onIndexSelected?: (index: number) => void;
}

export default function Tabs({
  items,
  className,
  handleTabChange,
  defaultIndex,
  showRadio,
  selectedIndex,
  onIndexSelected,
}: TabsProps): ReactElement {
  return (
    <ReactTabs
      className={`${className || ''}`}
      selectedIndex={selectedIndex}
      onSelect={onIndexSelected}
      defaultIndex={selectedIndex ? undefined : defaultIndex}
    >
      <div className={styles.tabListContainer}>
        <TabList className={styles.tabList}>
          {items.map((item, index) => (
            <Tab
              className={styles.tab}
              key={index}
              onClick={
                handleTabChange ? () => handleTabChange(item.title) : null
              }
              disabled={item.disabled}
            >
              {showRadio ? (
                <InputRadio
                  name={item.title}
                  type="radio"
                  checked={index === defaultIndex}
                  options={[item.title]}
                  readOnly
                />
              ) : (
                item.title
              )}
            </Tab>
          ))}
        </TabList>
      </div>
      <div className={styles.tabContent}>
        {items.map((item, index) => {
          console.log('item', item, 'index', index);
          return <TabPanel key={index}>{item.content}</TabPanel>;
        })}
      </div>
    </ReactTabs>
  );
}
