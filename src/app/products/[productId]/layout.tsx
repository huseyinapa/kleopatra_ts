// layout.tsx

import { Toaster } from "react-hot-toast";

interface ProductLayoutProps {
    children: React.ReactNode;
}

const ProductLayout = ({ children }: ProductLayoutProps): JSX.Element => {
    return <html lang="en">
        <body
            data-theme="valentine"
        >
            <Toaster position="bottom-right" reverseOrder={false} />
            {children}
        </body>
    </html>
};

export default ProductLayout;
