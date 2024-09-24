// layout.tsx

interface ProductLayoutProps {
    children: React.ReactNode;
}

const ProductLayout = ({ children }: ProductLayoutProps): JSX.Element => {
    return <div>{children}</div>;
};

export default ProductLayout;
