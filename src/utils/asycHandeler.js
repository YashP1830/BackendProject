//try and catch way OR async and await way

// const asycHandeler=(fn) => aynsc (req,res,next) => {
//         try {
//             await fn(req,res,next)
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success:false,
//                 message: error.message
//             })
//         }   
// }

//Creating asyncHandeler using Promise's

const asyncHandeler=(fn)=>(req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((err)=> next(err))
}

export {asyncHandeler}