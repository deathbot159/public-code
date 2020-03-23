let data = `1085
1085-5062
1085-5062-5380
1085-5062-5380-0071
1085-5062-5380-0071-3129
1085-5062-5380-0071-9850
1085-5062-5380-0071-5514
1085-5062-5380-4062
1085-5062-5380-4062-4178
1085-5062-5380-4062-9038
1085-5062-5380-4062-4826
1085-5062-5380-1639
1085-5062-5380-1639-0939
1085-5062-5380-1639-8699
1085-5062-5380-1639-3475
1085-5062-5109
1085-5062-5109-4869
1085-5062-5109-4869-8589
1085-5062-5109-4869-8670
1085-5062-5109-4869-4833
1085-5062-5109-1753
1085-5062-5109-1753-5172
1085-5062-5109-1753-1988
1085-5062-5109-1753-9727
1085-5062-5109-9727
1085-5062-5109-9727-3478
1085-5062-5109-9727-5778
1085-5062-5109-9727-6424
1085-6348
1085-6348-6528
1085-6348-6528-9045
1085-6348-6528-9045-2785
1085-6348-6528-9045-4578
1085-6348-6528-8933
1085-6348-6528-8933-6141
1085-6348-6528-8933-4661
1085-6348-2568
1085-6348-2568-1193
1085-6348-2568-1193-1200
1085-6348-2568-1193-0725
1085-6348-2568-8916
1085-6348-2568-8916-7105
1085-6348-2568-8916-6951
1085-6348-2568-8916-0435`;

data = data.split("\n");

data.sort((a, b) => a.length - b.length)

let object = "{ $data }";
let usedArr = [];

object = object.replace("$data", "\""+data[0]+`":{ $${data[0]}data }`);
let highKey = data[0];

data.forEach((value, index)=>{
    if(index != 0){
        if(value.includes(highKey+"-")) value = value.slice(highKey.length+1);
        if(usedArr.includes(value) == false){
            if(value.split("-").length > 1){
                let splited = value.split("-");
                usedArr.forEach(used=>{
                    if(used == splited[0]){
                        value = value.slice(used.length+1);
                        splited = splited.slice(1);
                        if(object.includes(`$${used}data`)){
                            let t = "";
                            if(splited.length == 1){
                                splited.forEach(splitedItem=>{
                                    object = object.replace(`$${used}data`, "\""+splitedItem+`": { $${splitedItem}data }, $${used}data`);
                                    t=splitedItem
                                })
                            }
                            if(!usedArr.includes(t) && t != "") usedArr.push(t);
                        }
                    }
                })
            }else{
                if(object.includes(`$${highKey}data`)){
                    object = object.replace(`$${highKey}data`, "\""+value+`": { $${value}data }, $${highKey}data`);
                }
                usedArr.push(value);
            }
        }
    }
})

usedArr.forEach(value=>{
    if(object.includes(`: { $${value}data }`) || object.includes(`, $${value}data `)){
        object = object.replace(`: { $${value}data }`, "");
        object = object.replace(`, $${value}data `, "");
    }
    if(object.includes(`{ "${value}",`)) object = object.replace(`{ "${value}",`, `["${value}",`);
    if(object.includes(`"${value}"},`)) object = object.replace(`"${value}"},`, `"${value}"],`);
    if(object.includes(`"${value}"}`))object = object.replace(`"${value}"}`, `"${value}"]`);
})
object = object.replace(`, $${highKey}data `, "");

console.log(object);
