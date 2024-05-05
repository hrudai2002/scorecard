import { jwtDecode } from 'jwt-decode'

export const authMiddleWare = (req, res, next) => {
    try {
        const token = req.headers.authorization; 
        if(!token) {
            return res.json({  
                success: false, 
                error: 'Authentication Invalid!' 
            });
        }
    
        const decodeToken = jwtDecode(token);
        if(!decodeToken) {
            return res.json({
                success: false,
                error: 'There was a problem authorizing the request.'
            })
        } 
        next();
    } catch (error) {
        return res.json({
            success: false,
            error: 'There was a problem authorizing the request.'
        })
    }
}