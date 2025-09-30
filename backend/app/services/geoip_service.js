import axios from 'axios';
import { env } from 'node:process';
export const geoIp = async (ip) => {
    try {
        const { data } = await axios.get(`http://ip-api.com/json/${env.NODE_ENV !== 'development' ? ip : ''}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return data;
    }
    catch (error) {
        console.error('Error detecting ip:', error);
        throw new Error(error.response?.data?.message || error.message);
    }
};
//# sourceMappingURL=geoip_service.js.map