export default async function handler(req, res) {
    return res.status(200).json({
        success: true,
        message: 'API ishlayapti!',
        env: {
            hasMongoUri: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET,
            nodeEnv: process.env.NODE_ENV
        }
    });
}
