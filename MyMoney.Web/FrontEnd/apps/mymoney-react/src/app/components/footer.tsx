import packageInfo from '../../../../../package.json';

export default function Footer() {
   return (
      <div className="sticky-bottom footer" style={{ float: 'right', marginBottom: '15px' }}>
         <span className="text-muted">
            <i>MyMoney v{packageInfo.version}</i>
         </span>
      </div>
   );
}
