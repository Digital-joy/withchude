import styles from './BaseTemplate.module.scss';

export interface IBaseTemplate extends React.ComponentPropsWithoutRef<'div'> {}

const BaseTemplate: React.FC<IBaseTemplate> = ({ className, ...divProps }) => {
  return (
    <div className={`${styles.container} ${className}`} {...divProps}></div>
  );
};

export default BaseTemplate;
