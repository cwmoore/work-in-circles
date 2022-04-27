// from ternary, denormalized, for a list of {compare:(a, b)=>(){return a>b}), result:}
const externary = (comparisonQA) => {
        return comparisonQA.
            reduce((acc, comparisonQA) => {
                return comparisonQA.counter++.compare ? acc.push(comparisonQA.counter.result) : null;
            }, [])
};
 
