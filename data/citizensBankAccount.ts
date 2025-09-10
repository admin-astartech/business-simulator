import { citizensData } from "./citizens";

// Add bank account data to each citizen using monetaryValue directly as bank balance
export const citizensWithBankData = [
    {
        ...citizensData[0], // John Doe
        bankBalance: citizensData[0].monetaryValue, // £55,000
        accountType: 'business' as const,
        lastTransaction: '2 hours ago'
    },
    {
        ...citizensData[1], // Jane Smith
        bankBalance: citizensData[1].monetaryValue, // £45,000
        accountType: 'checking' as const,
        lastTransaction: '1 day ago'
    },
    {
        ...citizensData[2], // Mike Johnson
        bankBalance: citizensData[2].monetaryValue, // £45,000
        accountType: 'savings' as const,
        lastTransaction: '30 minutes ago'
    },
    {
        ...citizensData[3], // Sarah Wilson
        bankBalance: citizensData[3].monetaryValue, // £38,000
        accountType: 'checking' as const,
        lastTransaction: '1 hour ago'
    },
    {
        ...citizensData[4], // David Brown
        bankBalance: citizensData[4].monetaryValue, // £35,000
        accountType: 'savings' as const,
        lastTransaction: '3 days ago'
    },
    {
        ...citizensData[5], // Emily Davis
        bankBalance: citizensData[5].monetaryValue, // £35,000
        accountType: 'checking' as const,
        lastTransaction: '45 minutes ago'
    },
    {
        ...citizensData[6], // Robert Garcia
        bankBalance: citizensData[6].monetaryValue, // £80,000
        accountType: 'business' as const,
        lastTransaction: '15 minutes ago'
    },
    {
        ...citizensData[7], // Lisa Martinez
        bankBalance: citizensData[7].monetaryValue, // £28,000
        accountType: 'savings' as const,
        lastTransaction: '2 days ago'
    },
    {
        ...citizensData[8], // James Anderson
        bankBalance: citizensData[8].monetaryValue, // £48,000
        accountType: 'business' as const,
        lastTransaction: '1 hour ago'
    },
    {
        ...citizensData[9], // Maria Rodriguez
        bankBalance: citizensData[9].monetaryValue, // £42,000
        accountType: 'savings' as const,
        lastTransaction: '20 minutes ago'
    },
    {
        ...citizensData[10], // Alexander Thompson
        bankBalance: citizensData[10].monetaryValue, // £150,000
        accountType: 'business' as const,
        lastTransaction: '5 minutes ago'
    },
    {
        ...citizensData[11], // Victoria Chen
        bankBalance: citizensData[11].monetaryValue, // £140,000
        accountType: 'business' as const,
        lastTransaction: '10 minutes ago'
    },
    {
        ...citizensData[12], // Benjamin Wright
        bankBalance: citizensData[12].monetaryValue, // £120,000
        accountType: 'business' as const,
        lastTransaction: '1 hour ago'
    },
    {
        ...citizensData[13], // Isabella Foster
        bankBalance: citizensData[13].monetaryValue, // £130,000
        accountType: 'business' as const,
        lastTransaction: '30 minutes ago'
    },
    {
        ...citizensData[14], // Christopher Lee
        bankBalance: citizensData[14].monetaryValue, // £180,000
        accountType: 'business' as const,
        lastTransaction: '15 minutes ago'
    },
    {
        ...citizensData[15], // Sophia Kumar
        bankBalance: citizensData[15].monetaryValue, // £100,000
        accountType: 'business' as const,
        lastTransaction: '2 hours ago'
    },
    {
        ...citizensData[16], // Oliver Martinez
        bankBalance: citizensData[16].monetaryValue, // £95,000
        accountType: 'business' as const,
        lastTransaction: '45 minutes ago'
    },
    {
        ...citizensData[17], // Amelia Taylor
        bankBalance: citizensData[17].monetaryValue, // £70,000
        accountType: 'business' as const,
        lastTransaction: '1 hour ago'
    },
    {
        ...citizensData[18], // William Clark
        bankBalance: citizensData[18].monetaryValue, // £18], // 25% = £175,000
        accountType: 'business' as const,
        lastTransaction: '20 minutes ago'
    },
    {
        ...citizensData[19], // Jennifer Adams
        bankBalance: citizensData[19].monetaryValue, // £19], // 25% = £275,000
        accountType: 'business' as const,
        lastTransaction: '5 minutes ago'
    },
    {
        ...citizensData[20], // Michael Chen
        bankBalance: citizensData[20].monetaryValue, // £20], // 25% = £262,500
        accountType: 'business' as const,
        lastTransaction: '10 minutes ago'
    },
    {
        ...citizensData[21], // Sarah Johnson
        bankBalance: citizensData[21].monetaryValue, // £21], // 25% = £245,000
        accountType: 'business' as const,
        lastTransaction: '15 minutes ago'
    },
    {
        ...citizensData[22], // David Rodriguez
        bankBalance: citizensData[22].monetaryValue, // £22], // 25% = £230,000
        accountType: 'business' as const,
        lastTransaction: '25 minutes ago'
    },
    {
        ...citizensData[23], // Lisa Thompson
        bankBalance: citizensData[23].monetaryValue, // £23], // 25% = £222,500
        accountType: 'business' as const,
        lastTransaction: '30 minutes ago'
    },
    {
        ...citizensData[24], // Robert Wilson
        bankBalance: citizensData[24].monetaryValue, // £24], // 25% = £212,500
        accountType: 'business' as const,
        lastTransaction: '45 minutes ago'
    },
    {
        ...citizensData[25], // Emily Brown
        bankBalance: citizensData[25].monetaryValue, // £25], // 25% = £205,000
        accountType: 'business' as const,
        lastTransaction: '1 hour ago'
    },
    {
        ...citizensData[26], // James Davis
        bankBalance: citizensData[26].monetaryValue, // £26], // 25% = £195,000
        accountType: 'business' as const,
        lastTransaction: '1 hour ago'
    },
    {
        ...citizensData[27], // Maria Garcia
        bankBalance: citizensData[27].monetaryValue, // £27], // 25% = £162,500
        accountType: 'checking' as const,
        lastTransaction: '2 hours ago'
    },
    {
        ...citizensData[28], // Christopher Martinez
        bankBalance: citizensData[28].monetaryValue, // £28], // 25% = £180,000
        accountType: 'business' as const,
        lastTransaction: '2 hours ago'
    },
    {
        ...citizensData[29], // Amanda Anderson
        bankBalance: citizensData[29].monetaryValue, // £29], // 25% = £170,000
        accountType: 'checking' as const,
        lastTransaction: '3 hours ago'
    },
    {
        ...citizensData[30], // Kevin Taylor
        bankBalance: citizensData[30].monetaryValue, // £30], // 25% = £187,500
        accountType: 'business' as const,
        lastTransaction: '3 hours ago'
    },
    {
        ...citizensData[31], // Rachel White
        bankBalance: citizensData[31].monetaryValue, // £31], // 25% = £155,000
        accountType: 'savings' as const,
        lastTransaction: '4 hours ago'
    },
    {
        ...citizensData[32], // Daniel Harris
        bankBalance: citizensData[32].monetaryValue, // £32], // 25% = £145,000
        accountType: 'savings' as const,
        lastTransaction: '4 hours ago'
    },
    {
        ...citizensData[33], // Jessica Clark
        bankBalance: citizensData[33].monetaryValue, // £33], // 25% = £160,000
        accountType: 'savings' as const,
        lastTransaction: '5 hours ago'
    },
    {
        ...citizensData[34], // Matthew Lewis
        bankBalance: citizensData[34].monetaryValue, // £34], // 25% = £237,500
        accountType: 'business' as const,
        lastTransaction: '5 hours ago'
    },
    {
        ...citizensData[35], // Stephanie Walker
        bankBalance: citizensData[35].monetaryValue, // £35], // 25% = £200,000
        accountType: 'business' as const,
        lastTransaction: '6 hours ago'
    },
    {
        ...citizensData[36], // Andrew Hall
        bankBalance: citizensData[36].monetaryValue, // £36], // 25% = £145,000
        accountType: 'checking' as const,
        lastTransaction: '6 hours ago'
    },
    {
        ...citizensData[37], // Nicole Allen
        bankBalance: citizensData[37].monetaryValue, // £37], // 25% = £180,000
        accountType: 'business' as const,
        lastTransaction: '7 hours ago'
    },
    {
        ...citizensData[38], // Ryan Young
        bankBalance: citizensData[38].monetaryValue, // £38], // 25% = £170,000
        accountType: 'business' as const,
        lastTransaction: '7 hours ago'
    },
    {
        ...citizensData[39], // Michelle King
        bankBalance: citizensData[39].monetaryValue, // £39], // 25% = £255,000
        accountType: 'business' as const,
        lastTransaction: '8 hours ago'
    },
    {
        ...citizensData[40], // Brandon Wright
        bankBalance: citizensData[40].monetaryValue, // £40], // 25% = £245,000
        accountType: 'business' as const,
        lastTransaction: '8 hours ago'
    },
    {
        ...citizensData[41], // Samantha Lopez
        bankBalance: citizensData[41].monetaryValue, // £41], // 25% = £230,000
        accountType: 'business' as const,
        lastTransaction: '9 hours ago'
    },
    {
        ...citizensData[42], // Tyler Hill
        bankBalance: citizensData[42].monetaryValue, // £42], // 25% = £220,000
        accountType: 'business' as const,
        lastTransaction: '9 hours ago'
    },
    {
        ...citizensData[43], // Ashley Scott
        bankBalance: citizensData[43].monetaryValue, // £43], // 25% = £215,000
        accountType: 'business' as const,
        lastTransaction: '10 hours ago'
    },
    {
        ...citizensData[44], // Justin Green
        bankBalance: citizensData[44].monetaryValue, // £44], // 25% = £205,000
        accountType: 'business' as const,
        lastTransaction: '10 hours ago'
    },
    {
        ...citizensData[45], // Brittany Adams
        bankBalance: citizensData[45].monetaryValue, // £45], // 25% = £197,500
        accountType: 'business' as const,
        lastTransaction: '11 hours ago'
    },
    {
        ...citizensData[46], // Zachary Baker
        bankBalance: citizensData[46].monetaryValue, // £46], // 25% = £187,500
        accountType: 'business' as const,
        lastTransaction: '11 hours ago'
    },
    {
        ...citizensData[47], // Lauren Nelson
        bankBalance: citizensData[47].monetaryValue, // £47], // 25% = £155,000
        accountType: 'checking' as const,
        lastTransaction: '12 hours ago'
    },
    {
        ...citizensData[48], // Nathan Carter
        bankBalance: citizensData[48].monetaryValue, // £48], // 25% = £170,000
        accountType: 'business' as const,
        lastTransaction: '12 hours ago'
    },
    {
        ...citizensData[49], // Megan Mitchell
        bankBalance: citizensData[49].monetaryValue, // £49], // 25% = £160,000
        accountType: 'checking' as const,
        lastTransaction: '1 day ago'
    }
]
