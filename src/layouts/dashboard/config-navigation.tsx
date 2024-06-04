import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: any) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'sales',
    path: '/sales',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/product',
    icon: icon('ic_cart'),
  }
];

export default navConfig;
