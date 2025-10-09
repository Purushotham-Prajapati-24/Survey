import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// --- VALIDATION SCHEMA --- //
const surveySchema = yup.object().shape({
    // Step 1
    thandaName: yup.string().required('Thanda Name is required'),
    houseNo: yup.string().required('House/Plot No is required'),
    surveyDate: yup.date().required('Date of survey is required').typeError('Please enter a valid date'),
    respondentName: yup.string().required('Respondent name is required'),
    gender: yup.string().required('Gender is required'),
    age: yup.number().typeError('Age must be a number').required('Age is required').min(18, 'Respondent must be at least 18'),
    mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
    aadhaar: yup.string().matches(/^[0-9]{12}$/, 'Aadhaar must be 12 digits').required('Aadhaar number is required'),
    
    // Step 2
    familyMembers: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Name is required'),
            age: yup.number().typeError('Age must be a number').required('Age is required').positive().integer(),
            gender: yup.string().required('Gender is required'),
            relationship: yup.string().required('Relationship is required'),
            education: yup.string(),
            occupation: yup.string(),
            income: yup.number().typeError('Income must be a number').min(0),
        })
    ).min(1, 'Please add at least one family member'),

    // Step 3
    livelihoodSources: yup.array(),
    agriLand: yup.string(),
    agriCrops: yup.string(),
    livestockType: yup.array(),
    livestockOther: yup.string(),
    
    // Step 4
    houseType: yup.string().required('House type is required'),
    ownership: yup.string().required('Ownership is required'),
    electricity: yup.string().required('Electricity status is required'),
    waterSource: yup.string().required('Water source is required'),
    toilet: yup.string().required('Toilet facility is required'),
    fuel: yup.string().required('Cooking fuel is required'),
    assets: yup.array(),
    
    // Step 5
    healthFacility: yup.string().required('This field is required'),
    schoolAccess: yup.string().required('This field is required'),
    rationCard: yup.string().required('This field is required'),
    schemes: yup.array(),

    // Step 6
    challenges: yup.array(),
    challengesOther: yup.string(),
    skillsDesired: yup.string(),
    techInterest: yup.string().required('This field is required'),
    techInterestDetails: yup.string().when('techInterest', {
        is: 'Yes',
        then: schema => schema.required('Please specify details'),
        otherwise: schema => schema,
    }),

    // Step 7
    improvements: yup.string(),
    decisionMaking: yup.string().required('This field is required'),
    trainingWillingness: yup.string().required('This field is required'),
    banjaraArt: yup.string().required('This field is required'),
    entrepreneurship: yup.string().required('This field is required'),
});


// --- HELPER COMPONENTS --- //

const FormInput = ({ label, name, register, errors, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input id={name} {...register(name)} {...props} className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-colors duration-300 ${errors[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
        {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
    </div>
);

const RadioGroup = ({ label, name, options, register, errors }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="flex items-center flex-wrap gap-x-6 gap-y-2 mt-2">
            {options.map(option => (
                <label key={option} className="flex items-center">
                    <input type="radio" value={option} {...register(name)} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2">{option}</span>
                </label>
            ))}
        </div>
        {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
    </div>
);

const CheckboxGroup = ({ label, name, options, register, errors }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
            {options.map(option => (
                <label key={option} className="flex items-center">
                    <input type="checkbox" value={option} {...register(name)} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2">{option}</span>
                </label>
            ))}
        </div>
        {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
    </div>
);


// --- FORM STEP COMPONENTS --- //

const Step1_Household = ({ register, errors }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="1. Thanda Name" name="thandaName" register={register} errors={errors} />
        <FormInput label="2. House / Plot No" name="houseNo" register={register} errors={errors} />
        <FormInput label="3. Date of Survey" name="surveyDate" type="date" register={register} errors={errors} />
        <FormInput label="4. Name of Respondent" name="respondentName" register={register} errors={errors} />
        <div className="md:col-span-2">
            <RadioGroup label="5. Gender" name="gender" options={['Male', 'Female', 'Other']} register={register} errors={errors} />
        </div>
        <FormInput label="6. Age" name="age" type="number" register={register} errors={errors} />
        <FormInput label="7. Mobile Number" name="mobile" type="tel" register={register} errors={errors} />
        <div className="md:col-span-2">
            <FormInput label="8. Aadhaar Number" name="aadhaar" type="text" register={register} errors={errors} />
        </div>
    </div>
);

const Step2_Demographic = ({ control, register, errors }) => {
    const { fields, append, remove } = useFieldArray({ control, name: "familyMembers" });
    return (
        <div>
            <p className="text-gray-500 mb-6">Please provide details for all members of the household.</p>
            {errors.familyMembers?.message && <p className="text-red-500 text-sm mb-2">{errors.familyMembers.message}</p>}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                     <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Member Name</th><th className="px-4 py-3">Age</th><th className="px-4 py-3">Gender</th><th className="px-4 py-3">Relationship</th><th className="px-4 py-3">Education</th><th className="px-4 py-3">Occupation</th><th className="px-4 py-3">Income (₹)</th><th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((item, index) => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2"><input {...register(`familyMembers.${index}.name`)} className="form-input text-sm p-2 w-full" placeholder="Name" />{errors.familyMembers?.[index]?.name && <p className="text-red-500 text-xs">{errors.familyMembers[index].name.message}</p>}</td>
                                <td className="p-2"><input {...register(`familyMembers.${index}.age`)} className="form-input text-sm p-2 w-20" type="number" placeholder="Age"/>{errors.familyMembers?.[index]?.age && <p className="text-red-500 text-xs">{errors.familyMembers[index].age.message}</p>}</td>
                                <td className="p-2"><input {...register(`familyMembers.${index}.gender`)} className="form-input text-sm p-2 w-24" placeholder="Gender"/>{errors.familyMembers?.[index]?.gender && <p className="text-red-500 text-xs">{errors.familyMembers[index].gender.message}</p>}</td>
                                <td className="p-2"><input {...register(`familyMembers.${index}.relationship`)} className="form-input text-sm p-2 w-full" placeholder="Relationship"/>{errors.familyMembers?.[index]?.relationship && <p className="text-red-500 text-xs">{errors.familyMembers[index].relationship.message}</p>}</td>
                                <td className="p-2"><input {...register(`familyMembers.${index}.education`)} className="form-input text-sm p-2 w-full" placeholder="Education" /></td>
                                <td className="p-2"><input {...register(`familyMembers.${index}.occupation`)} className="form-input text-sm p-2 w-full" placeholder="Occupation" /></td>
                                <td className="p-2"><input {...register(`familyMembers.${index}.income`)} className="form-input text-sm p-2 w-full" type="number" placeholder="Income" /></td>
                                <td className="p-2"><button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button type="button" onClick={() => append({ name: '', age: '', gender: '', relationship: '', education: '', occupation: '', income: '' })} className="mt-4 text-blue-600 font-semibold hover:text-blue-800">+ Add Family Member</button>
        </div>
    );
};

const Step3_Livelihood = ({ register, errors, watch }) => {
    const livelihoodSources = watch('livelihoodSources') || [];
    return (
        <div className="space-y-6">
           <CheckboxGroup 
                label="Select all applicable livelihood sources" name="livelihoodSources"
                options={['Agriculture', 'Livestock', 'Forest Produce', 'Wage Labour', 'Small Business', 'Government Job', 'Migration']}
                register={register} errors={errors} />
           {livelihoodSources.includes('Agriculture') && (
                <div className="mt-4 ml-8 pl-4 border-l-2 border-gray-200 space-y-4 animate-fadeIn">
                    <h3 className="font-semibold text-gray-700">Agriculture Details</h3>
                    <FormInput label="Land owned (acres)" name="agriLand" register={register} errors={errors} type="number" />
                    <FormInput label="Crops grown" name="agriCrops" register={register} errors={errors} />
                </div>
           )}
           {livelihoodSources.includes('Livestock') && (
                <div className="mt-4 ml-8 pl-4 border-l-2 border-gray-200 space-y-4 animate-fadeIn">
                    <h3 className="font-semibold text-gray-700">Livestock Details</h3>
                    <CheckboxGroup label="Type" name="livestockType" options={['Goats', 'Cattle', 'Poultry']} register={register} errors={errors} />
                    <FormInput label="Other livestock" name="livestockOther" register={register} errors={errors} />
                </div>
           )}
        </div>
    );
}

const Step4_Housing = ({ register, errors }) => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <RadioGroup label="Type of House" name="houseType" options={['Kutcha', 'Semi-Pucca', 'Pucca']} register={register} errors={errors} />
        <RadioGroup label="Ownership" name="ownership" options={['Own', 'Rented', 'Government-allotted']} register={register} errors={errors} />
        <RadioGroup label="Electricity Connection" name="electricity" options={['Yes', 'No']} register={register} errors={errors} />
        <RadioGroup label="Drinking Water Source" name="waterSource" options={['Borewell', 'Tanker', 'Stream', 'Other']} register={register} errors={errors} />
        <RadioGroup label="Toilet Facility" name="toilet" options={['Yes', 'No']} register={register} errors={errors} />
        <RadioGroup label="Cooking Fuel" name="fuel" options={['Firewood', 'LPG', 'Other']} register={register} errors={errors} />
        <div className="md:col-span-2 mt-4">
            <CheckboxGroup label="Household Assets" name="assets" options={['Mobile Phone', 'TV', 'Motorcycle', 'Tractor', 'Solar Panel', 'Bank Account']} register={register} errors={errors} />
        </div>
    </div>
);

const Step5_Services = ({ register, errors }) => ( 
    <div className="space-y-6">
        <RadioGroup label="Health Facility Nearby" name="healthFacility" options={['Yes', 'No']} register={register} errors={errors} />
        <RadioGroup label="School Access (within 3 km)" name="schoolAccess" options={['Yes', 'No']} register={register} errors={errors} />
        <RadioGroup label="Ration Card" name="rationCard" options={['Yes', 'No']} register={register} errors={errors} />
        <CheckboxGroup label="Government Schemes Availed" name="schemes" options={['Rythu Bandhu', 'MGNREGA', 'Aasara Pension', 'KCR Kit']} register={register} errors={errors} />
    </div> 
);

const Step6_Challenges = ({ register, errors, watch }) => {
    const techInterest = watch('techInterest');
    return (
        <div className="space-y-6">
            <CheckboxGroup 
                label="Major Challenges Faced" name="challenges" 
                options={['Lack of irrigation', 'Crop failure', 'Market access', 'Low wages', 'Debt', 'Health issues', 'Migration pressure', 'Climate variability']}
                register={register} errors={errors} />
            <FormInput label="Other challenges" name="challengesOther" register={register} errors={errors} />
            <FormInput label="Skills or Training Desired" name="skillsDesired" register={register} errors={errors} />
            <RadioGroup label="Interest in Tech-based Livelihoods" name="techInterest" options={['Yes', 'No']} register={register} errors={errors} />
            {techInterest === 'Yes' && <div className="animate-fadeIn"><FormInput label="If yes, specify" name="techInterestDetails" register={register} errors={errors} /></div>}
        </div>
    );
};

const Step7_Community = ({ register, errors }) => ( 
    <div className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">What changes would improve your livelihood?</label>
            <textarea {...register('improvements')} rows="3" className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-300"></textarea>
        </div>
        <RadioGroup label="Are women and youth involved in decision-making?" name="decisionMaking" options={['Yes', 'No']} register={register} errors={errors} />
        <RadioGroup label="Are you willing to take training to improve your livelihood?" name="trainingWillingness" options={['Yes', 'No']} register={register} errors={errors} />
        <h3 className="text-lg font-semibold text-gray-800 pt-4 border-t">Other</h3>
        <RadioGroup label="Do you know Banjara art?" name="banjaraArt" options={['Yes', 'No']} register={register} errors={errors} />
        <RadioGroup label="Would you like to translate the tradition into entrepreneurship?" name="entrepreneurship" options={['Yes', 'No']} register={register} errors={errors} />
    </div> 
);

const ThankYou = () => (
    <div className="text-center">
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 className="text-2xl font-semibold text-gray-900 mt-4">Thank You!</h2>
        <p className="text-gray-600 mt-2">Your response has been submitted successfully.</p>
    </div>
);

const stepFields = [
    ['thandaName', 'houseNo', 'surveyDate', 'respondentName', 'gender', 'age', 'mobile', 'aadhaar'],
    ['familyMembers'], [],
    ['houseType', 'ownership', 'electricity', 'waterSource', 'toilet', 'fuel'],
    ['healthFacility', 'schoolAccess', 'rationCard'],
    ['techInterest', 'techInterestDetails'],
    ['decisionMaking', 'trainingWillingness', 'banjaraArt', 'entrepreneurship']
];

// --- MAIN SURVEY FORM COMPONENT --- //
function SurveyForm() {
    const [step, setStep] = useState(1);
    const { register, handleSubmit, trigger, watch, control, formState: { errors } } = useForm({
        resolver: yupResolver(surveySchema),
        mode: 'onTouched'
    });
    
    const handleNext = async () => {
        const fields = stepFields[step - 1];
        const isStepValid = await trigger(fields);
        if (isStepValid) { setStep(prev => prev + 1); }
    };
    const prevStep = () => setStep(prev => prev - 1);
    const onSubmit = (data) => {
        console.log("Final Form Data:", data);
        setStep(prev => prev + 1);
    }

    const STEPS = [
        { number: 1, title: 'Part A: Household Identification', component: <Step1_Household register={register} errors={errors} /> },
        { number: 2, title: 'Part B: Demographic Profile', component: <Step2_Demographic control={control} register={register} errors={errors} /> },
        { number: 3, title: 'Part C: Livelihood Sources', component: <Step3_Livelihood register={register} errors={errors} watch={watch} /> },
        { number: 4, title: 'Part D: Housing & Assets', component: <Step4_Housing register={register} errors={errors} /> },
        { number: 5, title: 'Part E: Access to Services', component: <Step5_Services register={register} errors={errors} /> },
        { number: 6, title: 'Part F: Challenges & Aspirations', component: <Step6_Challenges register={register} errors={errors} watch={watch} /> },
        { number: 7, title: 'Part G: Community Voice', component: <Step7_Community register={register} errors={errors} /> },
        { number: 8, title: 'Submission Complete', component: <ThankYou /> }
    ];

    const currentStepData = STEPS[step - 1];
    const totalFormSteps = STEPS.length - 1;
    const progress = step > totalFormSteps ? 100 : ((step - 1) / (totalFormSteps - 1)) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Livelihood Assessment Survey</h1>
                <p className="text-gray-500 mt-2">A survey for the ST Community by DST-STIHUB</p>
            </div>

            {step <= totalFormSteps && (
                <div className="mb-8">
                    <div className="bg-gray-200 rounded-full h-2.5 w-full"><div className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div></div>
                </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white p-8 rounded-xl shadow-lg animate-fadeIn">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">{currentStepData.title}</h2>
                    {currentStepData.component}
                </div>
                <div className="flex justify-between mt-8">
                    {step > 1 && step <= totalFormSteps && ( <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 transition-transform duration-200 ease-in-out active:scale-95">Previous</button>)}
                    <div className="ml-auto">
                        {step < totalFormSteps && ( <button type="button" onClick={handleNext} className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-transform duration-200 ease-in-out active:scale-95">Next</button>)}
                        {step === totalFormSteps && ( <button type="submit" className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-transform duration-200 ease-in-out active:scale-95">Submit</button>)}
                    </div>
                </div>
            </form>
        </div>
    );
}

const animationStyle = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }
.form-input { @apply w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-300; }`;

const styleSheet = document.createElement("style");
styleSheet.innerText = animationStyle;
document.head.appendChild(styleSheet);

export default SurveyForm;
