import {} from 'lucide-react'
import { Button } from '../../ui/button';

const TabsBarTrigger = ({ value, icon, isActive }) => {
  return (
    <Button
      onClick={onClick}
      className={`px-4 py-2 text-sm transition-colors duration-200 ${
        !isActive
          ? 'text-gray-700 hover:text-gray-900'
          : 'font-semibold'
      } focus:outline-none focus:ring-none focus:ring-blue-500 rounded-none focus:ring-offset-0 outline-none`}
        value={value}   
    >
      {icon && <span className="mr-2">{icon}</span>}
        {value}
    </Button>
  );
}
TabsBarTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  icon: PropTypes.node,
  isActive: PropTypes.bool.isRequired,
};
export default TabsBarTrigger;