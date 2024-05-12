function date_format() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')    
}

function log(level, content) {
    time = date_format()
    line = time + ' | ' + level + ' | ' + content
    console.log(line)
}

function join(date, options, separator) {
    function format(option) {
        let formatter = new Intl.DateTimeFormat('en', option);
        return formatter.format(date);
    }
    return options.map(format).join(separator);
}

function get_logfile() {
    let options = [{year: 'numeric'}, {month: '2-digit'}, {day: '2-digit'}]; 
    filename = join(new Date, options, '-') + '.log';
    return filename;
}

module.exports = {
    log: log,
    get_logfile, get_logfile,
}
